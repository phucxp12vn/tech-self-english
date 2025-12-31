# Project Structure

This document provides an overview of the folder structure for the Frontend application.

## Root Directory

- **`src/`**: Contains the source code for the React application.
- **`public/`**: Static assets that are served as-is.
- **`vite.config.ts`**: Configuration file for Vite (bundler).
- **`.env.example`**: Example environment variables configuration.

## Source Directory (`src/`)

The `src` directory is organized as follows:

| Directory         | Description                                                                                                      |
| :---------------- | :--------------------------------------------------------------------------------------------------------------- |
| **`api/`**        | API integration modules. Contains Axios instance setup and API methods (e.g., `cardApi.ts`, `transcriptApi.ts`). |
| **`assets/`**     | Static assets imported within the code (images, styles, etc.).                                                   |
| **`components/`** | Reusable UI components used throughout the application.                                                          |
| **`constant/`**   | Application-wide constants and configuration values.                                                             |
| **`contexts/`**   | React Context definitions for global state management.                                                           |
| **`hook/`**       | Custom React hooks.                                                                                              |
| **`layout/`**     | Layout components defining the page structure (e.g., Headers, Sidebars, Main containers).                        |
| **`lib/`**        | Utility functions and libraries.                                                                                 |
| **`provider/`**   | Global providers wrapper (e.g., ThemeProvider, QueryClientProvider).                                             |
| **`routes/`**     | Routing configuration using React Router.                                                                        |
| **`types/`**      | TypeScript type definitions and interfaces.                                                                      |
| **`view/`**       | Page components representing different routes/views of the application.                                          |

## Key Files

- **`main.tsx`**: The entry point of the React application.
- **`App.tsx`**: The main App component, handling initialization and routing.
