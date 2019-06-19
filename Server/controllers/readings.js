const Reading = require('../models/tandhReading');


// GET /readings/tandh:
exports.getTempAndHumitidyReadings = (req, res, next) => {
    console.log('Get Readings Called!');

    res.status(200).json(
    {
        // posts: [
        //     {
        //         _id: '1',
        //         title: 'First Post', 
        //         content: 'You are doomed - Im coming for you!',
        //         imageUrl: 'images/duck.jpg',
        //         creator: {
        //             name: 'Stuart'
        //         },
        //         createdAt: new Date()
        //     }
        // ]
    });

};

exports.postTempAndHumitidyReadings = (req, res, next) => {
    const itemp = req.body.itemp;
    const otemp = req.body.otemp;
    const ihum = req.body.ihum;
    const ohum = req.body.ohum;
    const timestamp = new Date();

    console.log( 'Put Temp Readings Called with req.body = ', req.body);
    const reading = new Reading( itemp, otemp, ihum, ohum, timestamp );
    reading
        .save()
        .then( result => {
            console.log('Created Reading');
            res.status(200).json ( 
                {
                    message: 'Successfully created reading...'
                }
            )
        })
        .catch( err => {
            console.log(err);
        });
     

};


