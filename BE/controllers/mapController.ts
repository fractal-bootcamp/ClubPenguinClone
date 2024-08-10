import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../"));
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        cb(null, `entityMap_${timestamp}.json`);
    },
});

const upload = multer({ storage });


export const createEntityMap = [
    upload.single("file"),
    async (req: Request, res: Response) => {
        console.log(req);

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const outputPath = path.join(__dirname, `../${req.file.filename}`);

        try {
            console.log("hello");

            console.log(`Entity map written to ${outputPath}`);
            res
                .status(200)
                .json({ message: "Entity map saved successfully", path: outputPath });
        } catch (error) {
            console.error("Error processing entity map:", error);
            res
                .status(500)
                .json({ error: "Failed to process entity map", details: error });
        }
    }
];

export const getEntityMap = (req: Request, res: Response) => {

    // stub for the real getEntityMap function
};

export const fetchTestEntityMap = (req: Request, res: Response) => {
    const testEntityMap = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/utils/testMap.json'), 'utf8'));
    res.json(testEntityMap);
}