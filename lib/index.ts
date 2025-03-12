import { RespType } from "@/types";
import { NextResponse } from "next/server";

const sendResponse = (statusCode: number, response: RespType) => {
  return NextResponse.json(response, { status: statusCode });
};

export default sendResponse;
