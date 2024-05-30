import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  DatePicker,
  DateValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { UploadDropZone } from "../api/uploadthing";
import { apiurl } from "@/context/apiURL";
import GuestNav from "@/components/GuestNav";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [docURL, setDocURL] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [dob, setDob] = useState<DateValue | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"ATTENDEE" | "ORGANIZER">("ATTENDEE");
  const [password, setPassword] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignUp() {
    const res = await fetch(`${apiurl}/api/auth/register`, {
      body: JSON.stringify({
        name,
        dob: dob?.toDate("UTC"),
        role,
        email,
        password,
      }),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    const newUser = await res.json();
    if (res.ok) {
      const newDoc = await fetch(`${apiurl}/api/docs/create`, {
        credentials: "include",
        body: JSON.stringify({ docURL: docURL, user: newUser.user }),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (newDoc.status === 201) {
        router.replace("/signup/thanks");
      }
    }
  }

  return (
    <main className="">
      <GuestNav />
      <Card className="w-2/3 h-5/6 mx-auto my-10">
        <CardHeader className="text-2xl font-semibold ml-8">
          Sign Up:
        </CardHeader>
        <CardBody className="px-12">
          <div className=" flex flex-row gap-4 my-3">
            <Input
              type="text"
              label="Full Name"
              isRequired
              onValueChange={setName}
            />
            <DatePicker
              label="Date of Birth"
              onChange={setDob}
              isRequired
              showMonthAndYearPickers
            />
            <Select value={role} label="Role" isRequired>
              <SelectItem
                key="ATTENDEE"
                value="Attendee"
                onClick={() => setRole("ATTENDEE")}
              >
                Attendee
              </SelectItem>
              <SelectItem
                key="ORGANIZER"
                value="Organizer"
                onClick={() => setRole("ORGANIZER")}
              >
                Organizer
              </SelectItem>
            </Select>
          </div>
          <div className=" flex flex-row gap-4 my-3">
            <Input
              type="email"
              label="Email"
              isRequired
              onValueChange={setEmail}
            />
            <Input
              type={isVisible ? "text" : "password"}
              label="Password"
              isRequired
              onValueChange={setPassword}
              endContent={
                <Button onClick={() => setIsVisible(!isVisible)} variant="flat">
                  {isVisible ? "Hide" : "Show"}
                </Button>
              }
            />
          </div>
          {!docURL && (
            <div>
              <p className="text-center">
                Please upload an image of your government-issued ID:
              </p>
              <UploadDropZone
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                appearance={{ container: "h-2/3" }}
                onClientUploadComplete={(res) => {
                  toast("Upload Completed", { icon: "✔️" });
                  setDocURL(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  toast("Upload Failed", { icon: "❌" });
                }}
              />
            </div>
          )}
          {docURL && <p className="text-xl m-auto">ID Successfully Uploaded</p>}
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            variant={!docURL || !email || !password || !name ? "faded" : "flat"}
            isDisabled={!docURL || !email || !password || !name}
            onPress={handleSignUp}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}