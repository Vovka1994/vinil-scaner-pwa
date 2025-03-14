'use client';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EventScanner(props: any) {
  const { params } = props as { params: { id: string } };
  return <div>Event ID: {params.id}</div>;
}

// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/router'
// import { supabase } from '@/lib/supabase'
// import { BrowserQRCodeReader } from '@zxing/browser'

// // Типізація для клієнтського компонента в App Router
// export default function EventScanner({ params }: { params: { id: string } }) {
//   const [barcode, setBarcode] = useState<string | null>(null)
//   const [ticketInfo, setTicketInfo] = useState<any>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const codeReader = useRef<BrowserQRCodeReader | null>(null)
//   const controlsRef = useRef<any>(null)
//   const router = useRouter()

//   useEffect(() => {
//     codeReader.current = new BrowserQRCodeReader()
//     startScanner()
//     return () => stopScanner()
//   }, [])

//   const startScanner = async () => {
//     try {
//       if (videoRef.current && codeReader.current) {
//         controlsRef.current = await codeReader.current.decodeFromVideoDevice(
//           undefined,
//           videoRef.current,
//           (result, error) => {
//             if (result) {
//               setBarcode(result.getText())
//               checkBarcode(result.getText())
//             }
//             if (error && !(error instanceof Error && error.name === 'NotFoundException')) {
//               console.log('Scanning error:', error)
//             }
//           }
//         )
//       }
//     } catch (err) {
//       console.error('Scanner initialization error:', err)
//     }
//   }

//   const checkBarcode = async (code: string) => {
//     const { data } = await supabase
//       .from('tickets')
//       .select('*')
//       .eq('barcode', code)
//       .eq('event_id', params.id)
//       .single()
//     setTicketInfo(data)
//   }

//   const handleCheckInOut = async (type: 'in' | 'out') => {
//     if (!ticketInfo) return
    
//     await supabase
//       .from('ticket_logs')
//       .insert({
//         ticket_id: ticketInfo.id,
//         event_id: params.id,
//         type,
//         timestamp: new Date().toISOString()
//       })
//     await checkBarcode(barcode!)
//   }

//   const stopScanner = () => {
//     if (controlsRef.current) {
//       controlsRef.current.stop()
//     }
//     if (videoRef.current?.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream
//       stream.getTracks().forEach(track => track.stop())
//     }
//   }

// return (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//     <h1 className="text-2xl font-bold mb-4">Сканування квитка для події {params.id}</h1>
//     <div className="relative w-full max-w-md">
//       <video ref={videoRef} className="w-full rounded-lg shadow-lg" />
//       {barcode && (
//         <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-b-lg">
//           <p className="text-center text-lg font-semibold">Відскановано: {barcode}</p>
//           <button className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
//             Зареєструвати
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
// );
// }