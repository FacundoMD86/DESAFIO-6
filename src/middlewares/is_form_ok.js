export default function (req, res, next) {
    try {
        let { name,mail,password } = req.body
        if (name && mail && password) {
            next()
        } else {
            return res.status(400).json({
                status: 400,
                method: req.method,
                path: req.url,
                response: 'name, mail and password are required'
            })
        }
    } catch (error) {
        next(error)
    }
};
