import { HelloService } from "service";

module.exports.hello = async (event: any) => {
  const svc = new HelloService();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: svc.hello("dog"),
      input: event,
    }),
  };
};
