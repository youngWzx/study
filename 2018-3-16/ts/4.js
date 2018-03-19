var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["female"] = 1] = "female";
})(Gender || (Gender = {}));
;
var gen1 = Gender.male;
if (gen1 == Gender.ma1e) {
    console.log('男的');
}
else {
    console.log('女的');
}
