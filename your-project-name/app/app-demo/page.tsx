import { ProfileModel } from "@/lib/schema/profile";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import { Introduction } from "@/lib/types/introduction";
import { fetchIntro } from "@/lib/api";

export default async function AppDemo() {
  const introduction_data: Introduction | null = await fetchIntro();

  await connectToDatabase();
  const currentperson = await currentUser();
  const { userId } = await auth();

  const currentpersonidinmongoose = await ProfileModel.findOne({
    clerk_user_id: currentperson?.id,
  });

  // Existing condition: Create profile if it doesn't exist
  if (userId && !currentpersonidinmongoose && currentperson) {
    await ProfileModel.create({
      clerk_user_id: currentperson.id,
      username: currentperson.fullName,
      email: currentperson.emailAddresses?.[0]?.emailAddress,
      phonenumber: currentperson.phoneNumbers?.[0]?.phoneNumber ?? "",
      outh_provider: currentperson.externalAccounts?.[0]?.provider ?? "",
      outh_provider_id: currentperson.externalAccounts?.[0]?.id ?? "",
      outh_provider2: currentperson.externalAccounts?.[1]?.provider ?? "",
      outh_provider2_id: currentperson.externalAccounts?.[1]?.id ?? "",
      image_url: currentperson.imageUrl ?? "",
    });
  }

  // New condition: Update missing data if profile exists
  if (userId && currentpersonidinmongoose && currentperson) {
    // Check and update fields that are missing (empty strings)
    let updated = false;

    if (currentpersonidinmongoose.username === "" && currentperson.fullName) {
      currentpersonidinmongoose.username = currentperson.fullName;
      updated = true;
    }
    if (currentpersonidinmongoose.email === "" && currentperson.emailAddresses?.[0]?.emailAddress) {
      currentpersonidinmongoose.email = currentperson.emailAddresses[0].emailAddress;
      updated = true;
    }
    if (currentpersonidinmongoose.phonenumber === "" && currentperson.phoneNumbers?.[0]?.phoneNumber) {
      currentpersonidinmongoose.phonenumber = currentperson.phoneNumbers[0].phoneNumber;
      updated = true;
    }
    if (currentpersonidinmongoose.outh_provider === "" && currentperson.externalAccounts?.[0]?.provider) {
      currentpersonidinmongoose.outh_provider = currentperson.externalAccounts[0].provider;
      updated = true;
    }
    if (currentpersonidinmongoose.outh_provider_id === "" && currentperson.externalAccounts?.[0]?.id) {
      currentpersonidinmongoose.outh_provider_id = currentperson.externalAccounts[0].id;
      updated = true;
    }
    if (currentpersonidinmongoose.outh_provider2 === "" && currentperson.externalAccounts?.[1]?.provider) {
      currentpersonidinmongoose.outh_provider2 = currentperson.externalAccounts[1].provider;
      updated = true;
    }
    if (currentpersonidinmongoose.outh_provider2_id === "" && currentperson.externalAccounts?.[1]?.id) {
      currentpersonidinmongoose.outh_provider2_id = currentperson.externalAccounts[1].id;
      updated = true;
    }
    if (currentpersonidinmongoose.image_url === "" && currentperson.imageUrl) {
      currentpersonidinmongoose.image_url = currentperson.imageUrl;
      updated = true;
    }

    // Save the document only if updates were made
    if (updated) {
      await currentpersonidinmongoose.save();
    }
  }

  return (
    <div className="leading-relaxed px-4 sm:px-6">
      {userId ? (
        <>
          <div className="flex justify-center items-center mt-10 sm:mt-20 text-center">
            <div className="flex flex-col items-center gap-3 text-green-700">
              <p className="text-base sm:text-xl font-semibold">الصلاۃ و السلام علیک یا رسول اللہ ﷺ</p>
              <p className="text-base sm:text-xl font-semibold">الصلاۃ و السلام علیک یا حبیب اللہ ﷺ</p>
              <p className="text-base sm:text-xl font-semibold">الصلاۃ و السلام علیک یا نبی اللہ ﷺ</p>
              <p className="text-base sm:text-xl font-semibold">وعلی اٰلک و الصحابک یا خاتم النبیین ﷺ</p>
            </div>
          </div>
  
          <div className="w-full sm:w-3/4 mx-auto flex justify-end items-center my-4 sm:my-6 text-right">
            <p className="text-base sm:text-xl font-semibold">:👋{currentperson?.fullName} السلام علیکم و رحمۃ اللہ وبرکاتہ</p>
          </div>
  
          <div className="w-full sm:w-3/4 mx-auto">
            <p className="text-justify text-black text-sm sm:text-base">{introduction_data?.content}</p>
          </div>
  
          <div className="w-full sm:w-3/4 mx-auto">
            <p className="text-justify text-black font-bold text-sm sm:text-base mt-4">This post is created on: {introduction_data?._createdAt}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center my-40 sm:my-60 text-center px-4">
          <p className="text-lg sm:text-2xl font-bold text-red-500">Please login first to access.</p>
        </div>
      )}
    </div>
  );
}