import PostForm from "@/components/forms/PostForm"


const CreatePost = (post: any, INewPost: any) => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5x1 flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" width={36} height={36} alt="Criar">
          </img>
          <h2 className="h3-bold md:h2-bold text-left w-full">Criar Post</h2>
        </div>
        <PostForm />
      </div>
    </div>
  )
}

export default CreatePost