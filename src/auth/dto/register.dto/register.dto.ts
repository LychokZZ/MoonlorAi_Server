type RegisterType = {
    //UserReg
    Email:string;
    Name: string;
    Password: string;
    role: 'user' | 'psychologist';

    //Onboard
    emotionLevel: number;
    identityLevel: number;
    socialLevel: number;
    functionLevel: number;
}
export class RegisterDto {
    data: RegisterType;
}