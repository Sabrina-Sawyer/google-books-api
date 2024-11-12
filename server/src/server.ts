import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { fileURLToPath } from 'url';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const startServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // app.use(
    //     '/graphql',
    //     expressMiddleware(server, {
    //         context: async ({ req }) => {
    //             // Ensure headers are provided to the token function
    //             await new Promise((resolve, reject) =>
    //                 authenticateToken(req, {} as Response<any, Record<string, any>>, (err) => {
    //                     if (err) reject(err); // Reject if an error occurs
    //                     resolve(null); // Resolve if token verification passes or no auth header
    //                 })
    //             );

    //             // Return context, even without a user (for public access)
    //             return { req, user: req.user || null };
    //         },
    //     })
    // );
    app.use('/graphql', expressMiddleware(server as any,
        {
            context: authenticateToken as any
        }
    ));
    
    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist')));

        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    }

    // MongoDB connection error handling
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    // Start the server
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
};

startServer();
