# Video Summary Generator (React Frontend)

This is the React frontend for the Video Summary Generator application. It allows users to upload video files, select processing options (transcription, summary, highlights), and download the results. The frontend communicates with a Python backend via REST API.

## Features

- Upload video files (MP4, AVI, MOV, MKV)
- Select processing options: transcription, summary, highlight extraction
- View and download transcripts, summaries, and highlight videos
- Responsive UI built with Material-UI
- Error handling and status notifications

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- npm (v6 or above)

### Installation

1. **Clone the repository**

   ```sh
   git clone <repository-url>
   cd videopoc_react
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

### Running the App in Development Mode

```sh
npm start
```

- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- The page will reload if you make edits.

### Running Tests

```sh
npm test
```

### Building for Production

```sh
npm run build
```

- Builds the app for production to the `build` folder.

## Project Structure

```
videopoc_react/
├── public/
├── src/
│   ├── components/
│   │   ├── Analysis.tsx
│   │   └── VideoUpload.tsx
│   ├── App.tsx
│   └── ...
├── package.json
└── README.md
```

## Notes

- Make sure the backend server is running and accessible at the expected API URL (default: `http://localhost:5000`).
- You can configure API endpoints in the frontend code if needed.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
