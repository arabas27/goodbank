export function withSuspense(fn: any) {
  return function (...args: any[]) {
    let status = "pending";
    let response: Response | Error;

    const suspender = fn(...args).then(
      (res: Response) => {
        status = "success";
        response = res;
      },
      (err: Error) => {
        status = "error";
        response = err;
      }
    );

    return () => {
      switch (status) {
        case "pending":
          throw suspender;
        case "error":
          throw response;
        default:
          return response;
      }
    };
  };
}
