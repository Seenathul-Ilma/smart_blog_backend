import express, {Request, Response, NextFunction } from "express"

export const paginate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {


    

    try {
        
        next()
    } catch (err) {
        res.status(403).json({ message: "Pagination failed..!" })
    }

}

