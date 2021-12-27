const catchAsyncError = operationalFunction => {

    // Approach 1 (Looks clean & good 🐋🐋)
    return operationalFunction.catch(err => console.log(err));


    // Approach 2 🐳🐳
    // return async () => {
    //     try {
    //         await operationalFunction();
    //     }
    //     catch (err) {
    //         console.log(err)
    //     };
    // }
}

const promisFn = () => {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //     console.log("I'm a function that return a promise");
        // }, 1500)
        reject("Promise rejected");
    })
}

// const runPro = async () => {
//     try {
//         await tryExp();
//     }
//     catch (err) {
//         console.log(err);
//     }
// }

// const tryExp = async () => {
//     await promisFn();
// }

const runFn = catchAsyncError(async () => {
    await promisFn();
});

runFn();