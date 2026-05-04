import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Github, Linkedin, Phone, MapPin, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side - Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto lg:mx-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    AH
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              أحمد حسن
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6">
              مطور ويب و مصمم واجهات المستخدم
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
              أهتم بإنشاء تجارب رقمية مذهلة وسهلة الاستخدام. أعمل على تطوير تطبيقات ويب عصرية باستخدام أحدث التقنيات.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="mr-2 h-5 w-5" />
                تواصل معي
              </Button>
              <Button size="lg" variant="outline">
                <Github className="mr-2 h-5 w-5" />
                عرض المشاريع
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Badge variant="secondary" className="text-sm">
                <Phone className="mr-1 h-4 w-4" />
                +20 123 456 7890
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <MapPin className="mr-1 h-4 w-4" />
                القاهرة، مصر
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                متاح للعمل
              </Badge>
            </div>
          </div>
          
          {/* Right Side - Skills */}
          <div className="flex-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  المهارات الرئيسية
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  التخصصات والخبرات التي أتميز بها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">5+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">سنوات خبرة</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-gray-700">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">مشروع مكتمل</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">20+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">عميل راضٍ</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-gray-700">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">15+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">تقنية مُتقنة</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    التقنيات المُستخدمة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">React</Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">TypeScript</Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Tailwind CSS</Badge>
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Node.js</Badge>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Next.js</Badge>
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">MongoDB</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Social Links */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex justify-center gap-6">
          <Button variant="outline" size="icon" className="rounded-full">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;