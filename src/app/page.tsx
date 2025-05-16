import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="'w-[700px] h-[700px] bg-red-300">
        <Image
          src='/images/logo.jpeg'
          width={500}
          height={500}
         />
      </div>
    </main>
  );
}
