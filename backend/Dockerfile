# Use official Python image
FROM python:3.13-slim

# Set working directory inside the container
WORKDIR /app

# Copy dependency file first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend project
COPY . .

# Expose port Django will run on
EXPOSE 8000

# Run migrations first, then start Django server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
