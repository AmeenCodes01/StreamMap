import Countries from "../models/Countries.model.js";

<<<<<<< HEAD
export const checkCountry = async (req, res) => {
  //see if I can find the country
  try {
    const {country} = req.body;
    const Country = await Countries.findOne({country});
    console.log(Country, "country");
    if (Country) {
      return res.status(201).json({exist: true});
    } else {
      return res.status(201).json({exist: false});
=======

export const checkCountry =async (req,res)=>{
//see if I can find the country
try{
    const {country} = req.body
    const Country = await Countries.findOne({country})
    if(Country){
        return res.status(201).json({exist:true})
    }else{
        return res.status(201).json({exist:false})
>>>>>>> d4e93928d9703004befcade9474dc9cd9669468d
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({error: "Internal Server Error in checkCountry"});
  }
};

export const addCountry = async (req, res) => {
  try {
    const {country, color} = req.body;
    const Country = await Countries.findOne({country});
    if (Country) {
      return res.status(201).json({message: "Country already exists", Country});
    }
    const newCountry = new Countries({
      country,
      color,
    });
    await newCountry.save();
    console.log(newCountry, "country");

    res.status(201).json(newCountry);
  } catch (e) {
    console.log(e);
    res.status(500).json({error: "Internal Server Error in checkCountry"});
  }
};
