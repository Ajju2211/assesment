export default function(validate){
    return (req, res, next) => {
        try {
            const { error } = validate(req.body || {});
            if (error) {
                console.log('error: ', error);
                return res.status(400).json({
                    status: "failed",
                    message: error.details[0].message
                });
            }
            next();
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                status: "failed",
                message: err.message
            });
        }
    }
}