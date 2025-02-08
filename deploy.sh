#!/bin/bash

# Build and push Docker images
docker-compose build

# Deploy to cloud platform (example for Railway)
railway up

# Or deploy to Vercel (frontend)
cd frontend
vercel --prod 