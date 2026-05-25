import { IsNotEmpty, IsString } from "class-validator";

export class AddAnswerDto {
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content: string;

  @IsNotEmpty({ message: '考试ID不能为空' })
  examId: number;
}