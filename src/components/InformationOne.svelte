<script>
    export let alertColor = 'info'; // Set a default color if none is provided
  
    const getAlertStyle = () => {
      switch (alertColor) {
        case 'info':
          return 'alert alert-light-info color-info';
        case 'warning':
          return 'alert alert-light-warning color-warning';
        case 'danger':
          return 'alert alert-light-danger color-danger';
        case 'black':
          return 'alert alert-light-dark color-dark';
        default:
          return 'alert alert-light-info color-info';
      }
    };
  </script>
  
  <div class="{getAlertStyle()}" role="alert">
    <b style="color:red;">Important:</b> All Voluntary Donors are warned of likely misuse of blood donated by them at the hospital with or without the knowledge of the hospital management. At some places, the Brokers have taken the blood and sold it to others for a price. As a responsible citizen/voluntary blood donor, we request you to keep a watch on such people and hospitals. Donors must inform the Kurudhi team Members/Coordinators of such areas in case of any doubt.
  </div>
  
  <style>
    /* Add your custom styles for different alert colors here */
    .color-info {
      color: #17a2b8; /* Info color */
    }
  
    .color-warning {
      color: #ffc107; /* Warning color */
    }
  
    .color-danger {
      color: #dc3545; /* Danger color */
    }

    .color-black {
      color: #000; /* Danger color */
    }
  </style>
  