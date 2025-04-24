<script>
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const qrId = 'qr-local-test-001';

      const response = await fetch(`https://seuservidor.com/api/qrcode/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrId,
          ...coords,
        }),
      });

      const result = await response.json();
      console.log(result);
    },
    (err) => {
      console.error('Erro ao obter localização:', err);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    }
  );
</script>
