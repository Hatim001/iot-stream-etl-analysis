import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type Props = {};

const Hero = (props: Props) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <header className="bg-primary text-primary-foreground py-6 md:py-12 flex-1 w-full">
        <div className="container px-4 md:px-6 h-full flex flex-col items-center justify-between md:flex-row">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Unlock the Power of Device Data
            </h1>
            <p className="max-w-[600px] text-lg md:text-xl">
              Device Stream ETL Analysis helps you effortlessly extract,
              transform, and analyze data from your connected devices. Unlock
              valuable insights to drive your business forward.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row justify-center md:justify-start">
              <Button variant={"secondary"} onClick={() => signIn("cognito")}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Hero;
