import Link from "next/link";


const BirthdayCard = ({name,userId}) => {

    return (
            <Link className="relative h-[280px] w-[280px] md:h-[400px] md:w-[400px] flex justify-center items-center shrink-0" href={`/employee/${userId}`}>
                <div className="absolute top-0 bottom-0 left-0 right-0 rounded-lg  drop-shadow-2xl"
                    style={{ backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/020/574/294/small_2x/birthday-frame-with-balloon-free-png.png")', backgroundSize: 'cover', borderRadius: '1rem', backgroundRepeat: "no-repeat" }} />
                <div className="bg-trasparent rounded-lg  p-8 text-center w-fit relative z-10">
                    <h1 className="text-[18px] md:text-[28px] font-light text-gray-600 mb-4 pt-12 drop-shadow-lg">
                        Happy Birthday
                    </h1>
                    <h1 className="text-[18px] md:text-[28px] font-semibold text-gray-600 mb-4  drop-shadow-lg">
                        {name.split(" ")[0]}
                    </h1>
                </div>
            </Link>
    )
};

export default BirthdayCard;