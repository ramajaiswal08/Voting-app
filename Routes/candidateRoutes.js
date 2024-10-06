const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Uncommented bcrypt import
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

const checkadminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        return user.role === 'admin';
    }catch(err){
        return false;
    }
}


//post route to add a candidate
router.post('/', async (req, res) => {
    router.post('/signup', jwtAuthMiddleware, async (req, res) => {
        try {
            if(! await checkadminRole(req.user.id)){
                return res.status(404).json({message: 'user has not admin role'});
            }
            const data = req.body;
    
            // Create new user
            const newCandidate= new User(data);
            const savedUser = await newCandidate.save();
    
            res.status(200).json({ response: savedUser });
        } catch (err) {
            console.error('Error saving user:', err);
            res.status(500).json({ error: "Internal server error" });
        }
    })
router.put('/:candidateID', jwtAuthMiddleware,async (req, res) => {
        try {
            if(!checkadminRole(req.user.id)){
                return res.status(404).json({message: 'user has not admin role'});
            }
            const candidateID = req.params.candidateID;
            const updatedcandidateData = req.body;
    
            const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData, {
                new: true,
                runValidators: true,
            });
    
            console.log("Data updated");
            res.status(200).json(response);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        }
})

router.delete('/:candidateID', jwtAuthMiddleware,async (req, res) => {
    try {
        if(!checkadminRole(req.user.id)){
            return res.status(403).json({message: 'user does not have admin role'});
        }
        const candidateID = req.params.candidateID;
        

        const response = await Person.findByIdAndUpdate(candidateID)

        console.log("Data updated");
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
})

});


module.exports = router;
