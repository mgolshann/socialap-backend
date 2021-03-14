const { rejects } = require("assert");
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
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    //tags: [String],
    tags: [{ type: String, enum: ["nodejs", "reactjs"] }],
    teacher: {
        type: String,
        validate: {
            validator: function (input) {
                // new Promise((resolve, reject) => {
                //     setTimeout(() => {
                //         resolve(input.startsWith("مدرس"))
                //     }, 2000)
                // });
                    return input.startsWith("مدرس")
            },
            message: "teacher's name must start with modares!!"
        }
    },
    publishDate: { type: Date, default: Date.now },
    completed: { type: Boolean, default: true },
    price: {
        type: Number, required: function () {
            return this.completed
        }
    }
});

const CourseModel = mongoose.model('course', schemaCourse);

const newCourse = new CourseModel({
    name: "آموزش جامع نود 5",
    tags: ['nodejs', "js"],
    teacher: "ali golshan",
    completed: false,
    //price: 300000
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
    try {
        const savedCourse = await newCourse.save();
        console.log("course saved", savedCourse);
    } catch (err) {
        for (const field in err.errors) {
            console.log(err.errors[field].message)
        }
    }
}
createCourse();

async function getCourseList() {
    // const courseList = await CourseModel.find();
    const pageSize = 2;
    const pageNumber = 2;
    const courseList = await CourseModel
        .find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
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
    // .find({ teacher: /^ali/ }) // لیست کسایی که ابتدای اسمشون محمد دار رو بر میگردونه
    // .find({ teacher: /golshan$/ }) // دوره های اسم آخرشون گلشنه
    // .find({ teacher: /.*golshan.*/ }) // اون وسط گلشن باشه قبل و بعدش هر کارکتری که اومد ایراد نداره
    // .count();
    console.log(courseList);
}
//getCourseList();

// eq => equal to
// ne => not eqyal to
// gt => greater than
// gte => greater than or equal to
// lt
// lte
// in
//nin


// approach 1
async function updateCourseName(id, name) {
    const course = await CourseModel.findById(id);
    if (!course) return;
    course.name = name;
    console.log(await course.save());

}
// updateCourseName("604cd07b794b514bbc595742", "mgbg");

//approach 2
async function updateCourseName(id, name) {
    // const result = await CourseModel.update(
    //     {
    //         _id: id
    //     },
    //     {
    //         $set: {
    //             name: name
    //         },
    //     },
    // );
    // console.log(result)

    const result = await CourseModel.findByIdAndUpdate(id, {
        $set: {
            name: name
        },
    },
        { new: true } // وقتی که آپدیت کردی خروجی جدید رو نشون بده نه اینکه همون قبلی
    );
    console.log(result)
}

//updateCourseName("604ccffd0ef6625664180434", "Mohammad Golshan 3");

async function deleteCourse(id) {
    console.log(await CourseModel.findByIdAndDelete(id))
}
// deleteCourse("604ccffd0ef6625664180434")