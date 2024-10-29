import { Router } from "express";
import { createCategory, findAllCategories } from "../db/actions/categoria.actions.js";

const router = Router();

router.get('/all', async (req, res) => {
    try {
        const result = await findAllCategories();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/create', async (req, res) => {// para crear categoria
    const { nombre } = req.body;
    try {
        const result = await createCategory(nombre);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
