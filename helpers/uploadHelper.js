import multer from "multer";

const storage = multer.memoryStorage()
export let uploadHelper = multer({storage: storage})