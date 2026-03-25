FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Hugging Face Spaces expects port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["node", "app.js"]
