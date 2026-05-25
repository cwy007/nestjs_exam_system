import { IsNotEmpty, IsString } from "class-validator";

export class SaveExamDto {
  @IsNotEmpty({ message: 'ID不能为空' })
  id: number;

  @IsString({ message: '内容必须是字符串' })
  content: string;
}