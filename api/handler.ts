import { HelloService } from "service";

module.exports.hello = async ({
  queryStringParameters: { name },
}: {
  queryStringParameters: { name: string };
}) => {
  const svc = new HelloService();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: svc.hello(name ?? "dog"),
    }),
  };
};
