# Frontend Application

This is a Deno-based frontend application built with Vite.

## Running the Application

### Using VS Code

This project has been configured to run directly from VS Code using the launch configuration. Here are the available options:

1. **Run: Deno Frontend** - Runs only the frontend application
2. **Run: .NET Core Backend** - Runs only the backend application
3. **Run: Full Stack (Backend + Frontend)** - Runs both backend and frontend in sequence
4. **Backend + Frontend** (Compound) - Runs both backend and frontend simultaneously

To use any of these configurations:
1. Open the Run and Debug panel in VS Code (Ctrl+Shift+D or Cmd+Shift+D)
2. Select the desired configuration from the dropdown menu
3. Click the green play button or press F5

### Using Command Line

You can also run the application from the command line:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if needed)
# Deno will handle dependency installation automatically

# Start the development server
npm run dev
# or
deno task dev
```

The application will be available at http://localhost:3000.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run serve` - Serve the production build using Deno's file server 