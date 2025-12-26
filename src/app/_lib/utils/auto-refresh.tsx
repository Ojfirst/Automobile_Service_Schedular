// "use client"

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// type AutoRefreshProps = {
//   interval: number,
//   onInterval?: () => void,
// }

// const AutoRefresh = ({ interval = 10000, onInterval }: AutoRefreshProps) => {
//   const route = useRouter();


//   useEffect(() => {
//     const timer = setInterval(() => {

//       if (onInterval) {
//         try {
//           onInterval();
//         } catch (err) {
//           console.error('AutoRefresh onInterval handler error:', err);
//         }
//       }

//       route.refresh();
//     }, interval);
//     return () => clearInterval(timer);
//   }, [route, interval, onInterval]);

//   return null;

// }

// export default AutoRefresh