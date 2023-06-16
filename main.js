const express = require("express");
const https = require("https");
const app = express();
let day,citytyped,temp=0,condition="Clear",imageURL,currentcity,sunrise="00:00am",sunset="00:00pm",wind=0,humidity=0,visibility="0 km";

app.set('view engine', 'ejs');

app.use(express.static("css"));
app.use(express.urlencoded({extended:true})); 

var today=new Date();
    var options={
        weekday: "long",
    };
    let hours=today.getHours();
    let minutes=today.getMinutes();
    day = today.toLocaleDateString("en-US",options) +" , "+ hours +":"+minutes;

    https.get("https://geolocation-db.com/json/",function(res){
        res.on("data",function(data){
            const currentData=JSON.parse(data);
            citytyped=currentData.city;
            currentcity =currentData.city+","+currentData.country_name;
        })

    })  

app.get("/", function(req,res){
    
    res.render("list", {Date: day, city: citytyped,location: currentcity,currentTemp: temp,condition:condition,icon:imageURL,sunrise:sunrise,sunset:sunset,wind:wind,humidity:humidity,visibility:visibility});
        
});



app.post("/",function(req,res){
    citytyped=(req.body.city);
    const id = "5ebd2890cd473b6f1d099ac25c61a7d1"
    const url= "https://api.openweathermap.org/data/2.5/weather?q="+ citytyped + "&units=metric&appid="+ id +"";
    https.get(url, function(response){
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            temp = Math.round(weatherData.main.temp);
            condition = weatherData.weather[0].description;
            
            rise =weatherData.sys.sunrise;
            set=weatherData.sys.sunset;
            var risetime = rise;
            var setime = set;
            var risedate = new Date(risetime * 1000); 
            sunrise = risedate.toLocaleTimeString();
            var setdate = new Date(setime*1000);
            sunset = setdate.toLocaleTimeString();
            wind =Math.round(weatherData.wind.speed);
            humidity=weatherData.main.humidity;
            let visibilityinkm=weatherData.visibility/1000;
            visibility=Math.round(visibilityinkm.toFixed(2))+"km";
            let image = weatherData.weather[0].icon;
            imageURL="https://openweathermap.org/img/wn/"+ image + "@2x.png";
            
            res.redirect("/");
        })
    })
});


app.listen(3000, function(){
    console.log("server is running on port 3000.");
})