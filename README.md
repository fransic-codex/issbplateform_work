# ISSB Psychological Assessment Platform

A full-stack web application for psychological assessment and testing, inspired by ISSB (Inter Services Selection Board) evaluation methods. The platform allows users to take various psychological tests to evaluate traits like self-confidence, communication skills, leadership abilities, and more.

## Features

### User Features
- **Authentication System**: JWT-based secure login and registration
- **Dashboard**: View all available psychological tests
- **Quiz System**: Support for multiple question types:
  - Likert Scale (Strongly Agree → Strongly Disagree)
  - Frequency Scale (Not at all → Very Often)
  - True/False
  - Scenario-based Multiple Choice Questions
- **Progress Tracking**: Real-time progress indicator and timer
- **Results Analysis**: Detailed score breakdown with interpretation
- **Result History**: View past test results and track progress

### Admin Features
- **Test Management**: Create, edit, and delete psychological tests
- **Question Management**: Add, edit, and remove questions from tests
- **Scoring Configuration**: Define scoring logic for each question type
- **Bulk Operations**: Efficient management of test content

### Available Tests
1. Self Confidence Test
2. Influencing Ability Test
3. Persuasion Skills Test
4. Assertiveness Test
5. Bridging Ability Test
6. Self Motivation Test
7. Communication Skills Test
8. Courage Test
9. Self Determination Test
10. Self Efficacy Test
11. Positive Thinking Test
12. Responsibility Test

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React.js** with Vite
- **React Router** for navigation
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API calls

## Project Structure

```
issbPhyschological/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions (scoring engine)
│   ├── seed/            # Database seeding script
│   ├── server.js        # Backend entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   ├── context/     # React context (Auth)
│   │   └── utils/       # Utility functions
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with the following:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/issb-psychological
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

5. Seed the database:
```bash
npm run seed
```
This will create:
- An admin user (email: admin@issb.com, password: admin123)
- 12 psychological tests with sample questions

6. Start the backend server:
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## Usage

### User Flow

1. **Register/Login**: Create an account or log in with existing credentials
2. **Dashboard**: Browse available psychological tests
3. **Take a Test**: 
   - Select a test from the dashboard
   - Answer questions using the provided interface
   - Navigate between questions using next/previous buttons
   - Submit the test when complete
4. **View Results**: 
   - See your score and performance level
   - Read detailed interpretation
   - View answer breakdown
5. **History**: Access all past results from the Results page

### Admin Flow

1. Log in as admin (email: admin@issb.com, password: admin123)
2. Access Admin Panel from the navigation
3. **Manage Tests**:
   - Create new tests with title, category, description
   - Edit existing test details
   - Delete tests (and associated questions)
4. **Manage Questions**:
   - Select a test to view its questions
   - Add new questions with different types
   - Edit question text and options
   - Delete questions
   - Define scoring for each question

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get single test
- `GET /api/tests/:id/questions` - Get test with questions
- `POST /api/tests` - Create test (Admin)
- `PUT /api/tests/:id` - Update test (Admin)
- `DELETE /api/tests/:id` - Delete test (Admin)

### Questions
- `GET /api/questions/test/:testId` - Get questions by test
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (Admin)
- `POST /api/questions/bulk` - Bulk create questions (Admin)
- `PUT /api/questions/:id` - Update question (Admin)
- `DELETE /api/questions/:id` - Delete question (Admin)

### Results
- `GET /api/results` - Get user's results
- `GET /api/results/:id` - Get single result
- `GET /api/results/test/:testId` - Get results by test
- `POST /api/results` - Submit test result
- `DELETE /api/results/:id` - Delete result

## Scoring System

The platform uses a flexible scoring engine that supports:

1. **Likert Scale**: Scores based on agreement level (1-5)
2. **Frequency Scale**: Scores based on frequency (1-5)
3. **True/False**: Binary scoring (correct/incorrect)
4. **Multiple Choice**: Score based on correct answer selection

### Performance Levels
- **Excellent**: 90% and above
- **Good**: 75% - 89%
- **Average**: 60% - 74%
- **Below Average**: 40% - 59%
- **Poor**: Below 40%

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Railway Deployment

This project is configured for deployment on Railway. Follow these steps to deploy:

### Prerequisites
- A Railway account (sign up at railway.app)
- Git repository with your code
- Railway CLI (optional)

### Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect to Railway**:
   - Go to railway.app and log in
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Services**:
   - Railway will automatically detect the monorepo structure
   - Two services will be created:
     - `backend` (Node.js service)
     - `frontend` (Static site service)

4. **Set Environment Variables**:
   
   For the **Backend** service, add these variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```
   
   - For MongoDB, you can either:
     - Use Railway's MongoDB plugin (recommended)
     - Provide your own MongoDB Atlas connection string
   
   - If using Railway's MongoDB plugin, the `RAILWAY_MONGODB_URI` variable will be automatically set

5. **Configure Frontend API URL**:
   
   After the backend is deployed, Railway will provide a backend URL. Update the frontend to use this URL:
   - Go to the frontend service settings
   - Add environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

6. **Deploy**:
   - Railway will automatically build and deploy both services
   - Wait for the deployment to complete
   - You'll receive public URLs for both services

### Railway Configuration Files

The project includes these Railway configuration files:
- `railway.json` - Root configuration for monorepo
- `backend/railway.json` - Backend service configuration
- `frontend/railway.json` - Frontend service configuration

### MongoDB Setup on Railway

1. In your Railway project, click "New Service"
2. Select "Database" → "MongoDB"
3. Railway will provision a MongoDB instance
4. The connection string will be available as `RAILWAY_MONGODB_URI` environment variable

### Updating Backend URL in Frontend

After deployment, you may need to update the API URL in your frontend code. The backend uses the environment variable `VITE_API_URL` if set, otherwise it defaults to localhost:5000.

### Monitoring

- View deployment logs in Railway dashboard
- Monitor service health and metrics
- Set up alerts for errors or downtime

### Redeployment

Any push to your connected Git branch will trigger automatic redeployment on Railway.

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: Token expiration time (default: 7d)
- `NODE_ENV`: Environment (development/production)

### Frontend
- `VITE_API_URL`: Backend API URL (optional, defaults to localhost:5000)

## Security Considerations

1. **JWT Secret**: Change the `JWT_SECRET` in production
2. **MongoDB**: Use authentication and SSL in production
3. **CORS**: Configure CORS appropriately for production
4. **Password Hashing**: Passwords are hashed using bcryptjs
5. **Input Validation**: All inputs are validated on the backend

## Future Enhancements

- [ ] AI-based question generation
- [ ] Advanced analytics and insights
- [ ] Comparative analysis with peer groups
- [ ] Export results to PDF
- [ ] Email notifications for results
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with external assessment tools

## License

This project is for educational and assessment purposes.

## Support

For issues or questions, please contact the development team.

## Default Admin Credentials

- **Email**: admin@issb.com
- **Password**: admin123

⚠️ **Important**: Change the admin password after first login in production.
#   i s s b p l a t e f o r m _ w o r k 
 
 