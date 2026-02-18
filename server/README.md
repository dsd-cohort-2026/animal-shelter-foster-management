# Animal Shelter Foster Management Server

This is the backend server for the Animal Shelter Foster Management web application. It provides RESTful APIs for managing animals, users, items, and medical logs in the shelter system.

## Features

- Animal management (CRUD operations)
- User management
- Item tracking
- Medical log management
- Modular route and feature structure

## Project Structure

```
server/
├── index.js                # Entry point for the server
├── package.json            # Project dependencies and scripts
├── routes/
│   └── index.js            # Main router
└── features/
    ├── animals/
    │   ├── animals.controller.js
    │   ├── animals.repository.js
    │   ├── animals.routes.js
    │   └── animals.service.js
    ├── items/
    ├── medical-logs/
    └── users/
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Linting and Formatting

Run these commands from the repository root (`animal-shelter-foster-management/`):

```bash
npm install
npm run format
npm run lint
```

Check-only commands (no file changes):

```bash
npm run format:check
npm run lint
```

### Running the Server

Start the development server:

```bash
npm run dev
```

The server will start on the configured port (default: 8080).

## API Endpoints

- `/api/animals` - Manage animal records
- `/api/users` - Manage user accounts
- `/api/items` - Track shelter items
- `/api/medical-logs` - Manage medical logs

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Create a pull request

## License

MIT

## Contact

For questions or support, contact the project owner or open an issue in the repository.
