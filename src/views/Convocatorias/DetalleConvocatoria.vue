<template>
  <!-- ==============================================
    ** Inner Banner **
    =================================================== -->
  <div class="inner-banner blog">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="content">
            <h1>{{ convocatoriaData?.con_titulo || 'Convocatoria' }}</h1>
            <h4>
              <router-link to="/">INICIO</router-link>
            </h4>
            <h5>
              <a style="cursor: pointer" @click="clickBack()">
                {{ convocatoriaData?.tipo_conv_comun?.tipo_conv_comun_titulo || convocatoriaData?.tipo_conv_comun_titulo || 'Convocatorias' }}
              </a>
            </h5>
            <h3 v-if="convocatoriaData?.con_titulo">{{ convocatoriaData.con_titulo }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==============================================
    ** Blog Detail **
    =================================================== -->
  <div class="container blog-wrapper padding-lg">
    <div class="col-lg-8 col-12" v-if="convocatoriaNotFound">
      <div class="single-blog-inner mb-0 text-center py-5">
        <i class="fa fa-file-text-o text-muted" style="font-size: 4rem; opacity: 0.3;"></i>
        <h2 class="mt-4">Convocatoria no encontrada</h2>
        <p class="text-muted">
          La convocatoria que buscas no está disponible o fue eliminada.
        </p>
        <router-link to="/convocatorias" class="btn btn-outline mt-3">
          ← Volver a convocatorias
        </router-link>
      </div>
    </div>

    <div class="row" v-else-if="convocatoriaData">

      <div class="col-sm-8 blog-left">
        <ul class="blog-listing detail">
          <li>
            <a
              :href="imageUrl + convocatoriaData.con_foto_portada"
              target="_blank"
              rel="noopener noreferrer"
              :title="'Ver imagen ampliada: ' + convocatoriaData.con_titulo"
            >
              <img
                :src="imageUrl + convocatoriaData.con_foto_portada"
                :alt="convocatoriaData.con_titulo || 'Imagen de convocatoria'"
                class="img-responsive"
                style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; cursor: zoom-in;"
              />
            </a>
            <br>
            
            <ul class="post-detail">
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">Fecha de Inicio: </span> 
                {{ formatearFecha(convocatoriaData.con_fecha_inicio) }}
              </li>
              <li>
                <span class="icon-date-icon ico"></span>
                <span class="bold">Fecha de Final: </span> 
                {{ formatearFecha(convocatoriaData.con_fecha_fin) }}
              </li>
              <li>
                <span class="label">
                  {{ convocatoriaData.tipo_conv_comun?.tipo_conv_comun_titulo || convocatoriaData.tipo_conv_comun_titulo || 'CONVOCATORIA' }}
                </span>
              </li>
            </ul>
            
            <div class="imp-quote">
              <p v-html="convocatoriaData.con_descripcion"></p>
            </div>
            
            <!-- Botón para volver -->
            <div class="mt-4">
              <button @click="clickBack()" class="btn btn-outline">
                ← Volver
              </button>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-sm-4">
        <SidebarCustom />
      </div>

    </div>
    <div class="row" v-else>
      <div class="col-sm-8 blog-left text-center py-5">
        <div class="spinner-border text-muted" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando convocatoria...</p>
      </div>
      <div class="col-sm-4">
        <SidebarCustom />
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
  name: "DetalleConvocatoria",
  
  components: {
    SidebarCustom,
  },
  
  computed: {
    ...mapState(["convocatorias", "url_api"]),
    
    imageUrl() {
      return (process.env.VUE_APP_UPLOADS_URL || 'https://apiadministrador.upea.bo').trim();
    },
    
    convocatoriaData() {
      const convId = parseInt(this.$route.params.idConv);
      
      if (!convId || !this.convocatorias?.length) {
        return null;
      }
      
      const convocatoria = this.convocatorias.find(c => c.idconvocatorias === convId);
      
      if (!convocatoria || !convocatoria.idconvocatorias || (convocatoria.con_estado !== "1" && convocatoria.con_estado !== 1)) {
        return null;
      }
      
      return convocatoria;
    },
    
    convocatoriaNotFound() {
      return this.convocatorias?.length > 0 && !this.convocatoriaData;
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