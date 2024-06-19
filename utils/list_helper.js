const dummy = (blogs) => {
    return 1
  }

  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  };
// const totalLikes = (blogs) => {
//     return blogs.likes === totalLikes.likes 

//     console.log(onlyLike)
//     // const blogList = blog.map()
//     // const reducer = (sum, item) => {
//     //   return sum + item
//     // }
//     // return array.length === 0
//     // ? 0
//     // : array.reduce(reducer, 0) / array.length
// }

// totalLikes();

  
  
  module.exports = {
    dummy, totalLikes
  }