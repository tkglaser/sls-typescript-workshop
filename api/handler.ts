import { HelloService, Species } from "service";

module.exports.hello = async ({
  queryStringParameters: { name, species },
}: {
  queryStringParameters: { name: string; species: any };
}) => {
  const svc = new HelloService();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: svc.hello(name ?? "dog", species ?? Species.Human),
    }),
  };
};
