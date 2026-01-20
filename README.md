## Production Deployment (Docker)
The frontend is containerized using Nginx.
To run the full stack locally in production mode:
1. Create a `.env` file with `VITE_API_URL=http://localhost:4002/api`
2. Run `docker-compose up -d --build`
3. Access app at `http://localhost:8000`