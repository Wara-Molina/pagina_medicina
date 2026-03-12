<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ servicioData?.serv_nombre || 'Servicio' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <a style="cursor: pointer" @click="clickBack()">SERVICIOS</a>
          </h5>
          <h3 v-if="servicioData?.serv_nombre">{{ servicioData.serv_nombre }}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">

      <div class="col-sm-8 blog-left" v-if="servicioNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-wrench text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Servicio no encontrado</h2>
          <p class="text-muted">
            El servicio que buscas no está disponible o fue eliminado.
          </p>
          <button @click="clickBack()" class="btn btn-outline mt-3">
            ← Volver a servicios
          </button>
        </div>
      </div>

      <div class="col-sm-8 blog-left" v-else-if="servicioData">
        <ul class="blog-listing detail">
          <li> 
            <img
              :src="imageUrl + servicioData.serv_imagen"
              :alt="servicioData.serv_nombre || 'Imagen del servicio'"
              class="img-responsive"
              style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;"
            />
            
            <h2>{{ servicioData.serv_nombre }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">{{ formatearFecha(servicioData.serv_registro) }}</span>
              </li>
              <li v-if="servicioData.serv_nro_celular">
                <i class="fa fa-phone"></i>
                Contacto: 
                <a :href="'tel:+591' + String(servicioData.serv_nro_celular).replace(/[^0-9]/g, '')" class="bold">
                  {{ servicioData.serv_nro_celular }}
                </a>
              </li>
              <li><span class="label">Servicio</span></li>
            </ul>
            
            <p class="left-aligned">Descripción del servicio:</p>
            <p class="left-aligned" v-html="servicioData.serv_descripcion"></p>
            
            <!-- Botón para volver -->
            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="col-sm-8 blog-left" v-else>
        <div class="text-center py-5">
          <div class="spinner-border text-muted" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando servicio...</p>
        </div>
      </div>

      <div class="col-sm-4">
        <div class="blog-right">
          <SidebarCustom />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.bg-overlay-img {
  background-image: url("@/assets/Fondo2.jpg");
}

.text-muted {
  color: #6c757d;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding: 3rem 0;
}

.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mb-0 { margin-bottom: 0; }

.btn {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  border: none;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--main-color, #c00014);
  color: var(--main-color, #c00014);
}

.btn-outline:hover {
  background: var(--main-color, #c00014);
  color: #fff;
}

/* Post detail */
.post-detail {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.post-detail li {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-detail .label {
  background: var(--main-color, #c00014);
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.post-detail .bold {
  font-weight: 600;
}

/* Enlace de teléfono */
.post-detail a {
  color: inherit;
  text-decoration: none;
}

.post-detail a:hover {
  color: var(--main-color, #c00014);
}

/* Imagen responsive */
img.img-responsive {
  max-width: 100%;
  height: auto;
}

/* Spinner de carga */
.spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<script>
import { mapState } from "vuex";
import SidebarCustom from "@/components/SidebarCustom.vue";

export default {
  name: "DetalleServicio",
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["servicios", "url_api"]),

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },

    servicioData() {
      const servicioId = parseInt(this.$route.params.idServ);
      
      if (!servicioId || !this.servicios?.length) {
        return null;
      }

      const servicio = this.servicios.find(s => s.serv_id === servicioId);

      if (!servicio || (servicio.serv_active !== "1" && servicio.serv_active !== 1)) {
        return null;
      }
      
      return servicio;
    },
    servicioNotFound() {
      return this.servicios?.length > 0 && !this.servicioData;
    },
  },
  
  methods: {
    formatearFecha(fechaISO) {
      if (!fechaISO) return '';
      const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    },

    clickBack() {
      this.$store.commit("clickLink");
      this.$router.go(-1);
    },
  },
  
  created() {

    this.$store.commit("loading");
  },
};
</script>