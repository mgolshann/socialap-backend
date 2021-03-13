const { findSourceMap } = require("module");
const mongoose = require("mongoose");


mongoose
    .connect("mongodb://localhost:27017/courseDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.log("db not connected: ", err);
    });

const schemaCourse = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [String],
    teacher: String,
    publishDate: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    price: Number
});

const CourseModel = mongoose.model('course', schemaCourse);

const newCourse = new CourseModel({
    name: "آموزش جامع نود 5",
    tags: ['node js', 'js'],
    teacher: "ali golshan",
    completed: true,
    price: 300000
});


// newCourse
//     .save()
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log("sth bad happend!!");
//     });

async function createCourse() {
    const savedCourse = await newCourse.save();
    console.log("course saved", savedCourse);
}
//createCourse();

async function getCourseList() {
    // const courseList = await CourseModel.find();
    const courseList = await CourseModel
        // .find({
        //     completed: false,
        //     teacher: "ali golshan2"
        // })
        // .limit(3)
        // .sort({ name: 1 }) /* 1 ASC -1 DESC */
        // .select({ name: 1, tags: 1 });
        // .find({
        //     price: {
        //         $gte: 100000,
        //         $lte: 200000
        //     }
        // })
        // .find({
        //     price: {
        //         $in : [100000, 70000, 50000]
        //     }
        // })
        // .find()
        // .or([{ completed: true }, { price: 100000}])
        // .and([{ completed: true }, { price: 100000}])
        // .sort({ name: 1 })
        .find({ teacher: /^ali/ }) // لیست کسایی که ابتدای اسمشون محمد دار رو بر میگردونه
        .find({ teacher: /golshan$/ }) // دوره های اسم آخرشون گلشنه
        .find({ teacher: /.*golshan.*/ }) // اون وسط گلشن باشه قبل و بعدش هر کارکتری که اومد ایراد نداره
    console.log(courseList);
}

// eq => equal to
// ne => not eqyal to
// gt => greater than
// gte => greater than or equal to
// lt
// lte
// in
//nin

getCourseList();

