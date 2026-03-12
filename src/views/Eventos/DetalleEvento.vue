<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ eventoData?.evento_titulo || 'Evento' }}</h1>
          </div>
          <h4>
            <router-link to="/">INICIO</router-link>
          </h4>
          <h5>
            <router-link to="/eventos">EVENTOS</router-link>
          </h5>
          <h3 v-if="eventoData?.evento_titulo">{{ eventoData.evento_titulo }}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="row">

      <div class="col-sm-8 blog-left" v-if="eventoNotFound">
        <div class="single-blog-inner mb-0 text-center py-5">
          <i class="fa fa-calendar text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
          <h2 class="mt-4">Evento no encontrado</h2>
          <p class="text-muted">
            El evento que buscas no está disponible o fue eliminado.
          </p>
          <router-link to="/eventos" class="btn btn-outline mt-3">
            ← Volver a eventos
          </router-link>
        </div>
      </div>
      <div class="col-sm-8 blog-left" v-else-if="eventoData">
        <ul class="blog-listing detail">
          <li> 
            <img
              :src="imageUrl + eventoData.evento_imagen"
              :alt="eventoData.evento_titulo || 'Imagen del evento'"
              class="img-responsive"
              style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
            />
            
            <h2>{{ eventoData.evento_titulo }}</h2>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">{{ formatearFecha(eventoData.evento_fecha) }}</span>
              </li>
              <li v-if="eventoData.evento_lugar">
                <span class="fa fa-map-marker"></span>
                <span class="bold">Lugar: </span>
                {{ eventoData.evento_lugar }}
              </li>
              <li v-if="eventoData.evento_hora">
                <span class="fa fa-clock-o"></span>
                <span class="bold">Hora: </span>
                {{ eventoData.evento_hora }}
              </li>
              <li>
                <span class="label">
                  <router-link to="/eventos">
                    {{ eventoData.tipo_evento || eventoData.evento_tipo || 'EVENTO' }}
                  </router-link>
                </span>
              </li>
            </ul>
            
            <p class="left-aligned">Descripción del evento:</p>
            <p class="left-aligned" v-html="eventoData.evento_descripcion"></p>
            
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
          <p class="mt-3 text-muted">Cargando evento...</p>
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

.post-detail .label a {
  color: inherit;
  text-decoration: none;
}

.post-detail .bold {
  font-weight: 600;
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
  name: "DetalleEvento",
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["eventos", "url_api"]),

    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },
    eventoData() {
      const eventoId = parseInt(this.$route.params.idEv);
      
      if (!eventoId || !this.eventos?.length) {
        return null;
      }
      const evento = this.eventos.find(e => e.evento_id === eventoId);
      if (!evento || !evento.evento_id) {
        return null;
      }
      
      return evento;
    },
    eventoNotFound() {
      return this.eventos?.length > 0 && !this.eventoData;
    },
  },
  
  methods: {
    formatearFecha(fechaISO) {
      if (!fechaISO) return 'Fecha no disponible';
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