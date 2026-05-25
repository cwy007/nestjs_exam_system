import { HttpException, HttpStatus, ParseIntPipe } from "@nestjs/common";

export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory: () => {
      return new HttpException(`${name} 必须是数字`, HttpStatus.BAD_REQUEST);
    }
  })
}
