// components/BarcodeScanner.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = () => {
  const [scanResult, setScanResult] = useState<string>('Результат з’явиться тут');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('reader');

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    };

    const startScanner = () => {
      if (scannerRef.current && !isScanning) {
        scannerRef.current
          .start(
            { facingMode: 'environment' },
            config,
            (decodedText: string) => {
              setScanResult(`Знайдено штрих-код: <strong>${decodedText}</strong>`);
              stopScanner();
            },
            (error: string) => {
              console.warn(`Помилка сканування: ${error}`);
            }
          )
          .then(() => setIsScanning(true))
          .catch((err: string | Error) => {
            console.error('Помилка запуску сканера:', err);
            setScanResult('Помилка: не вдалося отримати доступ до камери.');
          });
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
          console.log('Сканер зупинено');
        })
        .catch((err: string | Error) => console.error('Помилка зупинки:', err));
    }
  };

  const handleStopClick = () => {
    stopScanner();
    setScanResult('Сканування зупинено. Натисніть "Почати сканування", щоб продовжити.');
  };

  const handleStartClick = () => {
    if (scannerRef.current && !isScanning) {
      scannerRef.current
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            setScanResult(`Знайдено штрих-код: <strong>${decodedText}</strong>`);
            stopScanner();
          },
          (error: string) => console.warn(`Помилка сканування: ${error}`)
        )
        .then(() => setIsScanning(true))
        .catch((err: string | Error) => {
          console.error('Помилка запуску:', err);
          setScanResult('Помилка: не вдалося отримати доступ до камери.');
        });
    }
  };

  return (
    <div className="scanner-container">
      <h1>Сканер штрих-кодів</h1>
      <div id="reader" ref={readerRef} className="reader"></div>
      <div className="result" dangerouslySetInnerHTML={{ __html: scanResult }} />
      <div className="buttons">
        {isScanning ? (
          <button onClick={handleStopClick}>Зупинити сканування</button>
        ) : (
          <button onClick={handleStartClick}>Почати сканування</button>
        )}
      </div>

      <style jsx>{`
        .scanner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f0f0f0;
          padding: 20px;
        }
        .reader {
          width: 100%;
          max-width: 500px;
          border: 2px solid #333;
          border-radius: 5px;
        }
        .result {
          margin-top: 20px;
          font-size: 18px;
          color: #333;
          word-wrap: break-word;
          max-width: 500px;
          text-align: center;
        }
        .buttons {
          margin-top: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;