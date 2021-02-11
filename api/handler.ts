import { HelloService, Species } from "service";

interface HelloRequest {
  queryStringParameters: { name: string; species: any };
}

module.exports.hello = async (request: HelloRequest) => {
  const svc = new HelloService();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: svc.hello(
        request?.queryStringParameters?.name ?? "dog",
        request?.queryStringParameters?.species ?? Species.Human
      ),
    }),
  };
};
