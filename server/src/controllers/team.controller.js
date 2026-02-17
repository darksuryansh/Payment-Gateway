import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TeamMember } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import ActivityLog from '../models/mongo/ActivityLog.js';

/**
 * POST /api/team/invite
 */
export const inviteTeamMember = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const existing = await TeamMember.findOne({ where: { email } });
    if (existing) return errorResponse(res, 409, 'Email already in use.');

    const hashedPassword = await bcrypt.hash(password, 12);

    const member = await TeamMember.create({
      merchant_id: req.merchant.id,
      name,
      email,
      password: hashedPassword,
      role: role || 'viewer',
      permissions: permissions || {},
      invited_by: req.teamMember?.id || null,
    });

    await ActivityLog.create({
      merchant_id: req.merchant.id,
      action: 'team_member_invited',
      details: { member_id: member.id, email, role },
      ip_address: req.ip,
    });

    return successResponse(res, 201, 'Team member invited.', {
      team_member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/team/login
 */
export const teamLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const member = await TeamMember.findOne({ where: { email } });
    if (!member) return errorResponse(res, 401, 'Invalid credentials.');
    if (!member.is_active) return errorResponse(res, 403, 'Account is deactivated.');

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return errorResponse(res, 401, 'Invalid credentials.');

    const token = jwt.sign(
      { team_member_id: member.id, merchant_id: member.merchant_id, role: member.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await member.update({ last_login: new Date() });

    await ActivityLog.create({
      merchant_id: member.merchant_id,
      action: 'team_member_login',
      details: { member_id: member.id, email },
      ip_address: req.ip,
    });

    return successResponse(res, 200, 'Login successful.', {
      token,
      team_member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/team/members
 */
export const listTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.findAll({
      where: { merchant_id: req.merchant.id },
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Team members retrieved.', { team_members: members });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/team/members/:id
 */
export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!member) return errorResponse(res, 404, 'Team member not found.');

    const { name, role, permissions, is_active } = req.body;

    await member.update({
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(permissions !== undefined && { permissions }),
      ...(is_active !== undefined && { is_active }),
    });

    return successResponse(res, 200, 'Team member updated.', {
      team_member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions,
        is_active: member.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/team/members/:id
 */
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!member) return errorResponse(res, 404, 'Team member not found.');

    await member.update({ is_active: false });
    return successResponse(res, 200, 'Team member deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/team/activity-log
 */
export const getActivityLog = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find({ merchant_id: req.merchant.id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ merchant_id: req.merchant.id });

    return successResponse(res, 200, 'Activity log retrieved.', {
      activity_log: logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};
