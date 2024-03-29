import { BaseSyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Subject, UserDetails, TypingMode } from "@/types";
import Result from "./Result";
import Timer from "../../shared/timer";
import classes from "./styles.module.scss";

type Props = {
  userDetails: UserDetails;
  subject: Subject;
  mode: TypingMode;
};

const practicePassageEnglish =
  "The great advantage of early rising is the good start it gives us in our day's work. The early riser has done a large amount of hard work before other men have got out of bed. In the early morning the mind is fresh, and there are few sounds or other distractions, so that work done at that time is generally well done. In many cases the early riser also finds time to take some exercise in the fresh morning air, and this exercise supplies him a fund of energy that will last until the evening. By beginning so early, he knows that he has plenty of time to do thoroughly all the work he can be expected to do, and is not tempted to hurry over any part of it. All his work being finished in good time, he has a long interval of rest in the evening before the timely hour when he goes to bed. He gets to sleep several hours before midnight, at the time when sleep is most refreshing and after a sound night's rest, rises early next morning in good health and spirits for the labors of a new day. It is very plain that such a life as this is far more conducive to health than that of the man who shortens his waking hours by rising late, and so can afford in the course of the day little leisure for necessary rest. Anyone who lies in bed late, must, if he wishes to do a full day's work, go on working to a correspondingly late hour, and deny himself the hour or two of evening exercise that he ought to take for the benefit of his health. But in spite of all his efforts, he will probably produce as good results as the early riser, because he misses the best working hours of the day. It may be objected to this that some find the perfect quiet of midnight by far the best time for working. This is no doubt true in certain cases. Several great thinkers have found by experience that their intellect is clearest, and they can write best, when they burn the midnight oil. But even in such cases the practice of working late at night cannot be commended. Few men, if any, can exert the full power of their intellect at the time when nature prescribes sleep, without ruining their health thereby.";

const practicePassageMarathi =
  "गुढीपाडवा म्हणजे हिंजू नववर्षाचा पहिला दिवस. हा सण चैत्र शुद्ध प्रतिपदेला साजरा करण्यात येताे. संपूर्ण भारतात व प्रामुख्याने महाराष्ट्रात माेठ्या उत्साहाने हा सण साजरा केला जाताे. नववर्षाचे स्वागत करण्यासाठी घराच्या दारासमाेर गुढी उभारली जाते. गुढी उभारण्यासाठी लांब बांबूच्या टाेकाला रेश्‍मी वस्त्र बांधले जाते. त्यावर साखरेची माळ, कडुलिंबाची पाने, आंब्याच्या डहाळ्या व झेंडूच्या फुलांचे हार बांधल जाते व त्यावर एक कलश ठेवला जाताे. ही गंढी आकाशाच्या दिशेले उभारली जाते. या गुढीला विजयाचे प्रतीक मानले जाते. चाैदा पर्षांचा वनवास संपवून प्रभू श्रीराम जेव्हा अयाेध्या आले व त्यांचे राजभिषेक झाले तेव्हा हा सण साजरा केला गेला असे मानले जाते. गुढीपाडव्याच्या दिवशी कडुलिंबाच्या काेवळ्या पानांचे सेवन करण्याची पद्धत आहे. यामुळे रक्त शुद्ध हाेते व शरीराची राेगप्रतिकारक शक्ती वाढते. या दिवशी अनेक कुटुंबात पुरणपाेळी किंवा श्रीखंड पुरीचा छान बेत असताे. झालं गेलं विसरून आयुष्याला नव्या उत्साहाने व आनंदाने सामाेरे जावे हाच संदेश गुढीपाडव्याचा सण आपलला देत असताे. गुढीपाडवा हा भारतीय संस्कृतीतला एक महत्त्वाचा सण आहे. हिंदू दिनदर्शिकेप्रमाणे चैत्र शुद्ध प्रतिपदेला म्हणजेच वसंत ऋतूचा पहिल्या दिवशी ही सण साजरा केला जाताे. नववर्षाचा हा पहिला दिवस अतिशय पवित्र मानला जाताे. वसंत ऋतूची चाहूल देणारा हा गुढीपाडवा संपूर्ण भारतात माेठ्या उत्साहाने साजरा केला जाताे. व जास्ती करून महाराष्ट्रतात प्रभू रामचंद्रानी रावणाचा पराभव करून वनवास संपून आयाेध्या नगरी मध्ये प्रवेश केला. त्या दिवशी श्रीरामाचे स्वागत करण्यासाठी आयाेध्येतील प्रजेने गुढ्या, ताेरण उभारली हाेती आणि आनंद साजरा केला हाेता. तीच प्रथा वर्षानुवर्षे चालत आली म्हणून. आजही घराेघरी गुढी उभारली जाते. दारासमाेर सुबक रांगाेळी काढली जाते. या नवीन वर्षाचे स्वागत करण्यासाठी घराच्या दारासमाेर गुढी उभारली जाते. गुढी उभारण्यासाठी लांब काठी घेऊन तिच्या टाेकावर जरीचे किंवा रेशमी वस्त्र बांधले जाते. त्यावर कडुलिंबाचे पाने, रंगीबिरंगी बत्ताश्‍याची माळ, आंब्याच्या डहाळ्या फुलांच्या माळा बांधल्या जातात. आणि त्या वर एक कलश ठेवला जाताे. ती गुढी बांधून तिची पूजा केली जाते.";

const EnglishPracticeArea = ({ userDetails, subject }: Props) => {
  console.log({ userDetails, subject });

  const restrictActions = (event: BaseSyntheticEvent) => {
    event?.preventDefault?.();
    return false;
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-4">
        <div className="col-span-3">
          <Timer
            initialValue={0}
            interval={1000}
            isCountdown={false}
            shouldStart={false}
          />
          <div className="flex flex-col gap-[20px]">
            <Textarea
              className={`resize-none h-[200px] font-medium text-md text-black ${classes.passageText}`}
              disabled
              value={
                subject === "ENGLISH"
                  ? practicePassageEnglish
                  : practicePassageMarathi
              }
            />
            <div className="flex gap-[10px] flex-col">
              <Textarea
                onPaste={restrictActions}
                onCopy={restrictActions}
                className="h-[200px] resize-none font-normal text-md text-black"
                placeholder="Type your passage here."
              />
              {<Button>Submit Passage</Button>}
            </div>
          </div>
        </div>
        <div className="col-span-3 xl:col-span-1">
          <Result totalWordsCount={0} />
        </div>
      </div>
    </>
  );
};

export default EnglishPracticeArea;
