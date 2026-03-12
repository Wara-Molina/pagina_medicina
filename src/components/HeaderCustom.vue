<template>
  <TopHeaderCustom v-if="isHome" />

  <header id="header" class="sticky-header">
    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-collapse collapse" id="navbar">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <router-link data-toggle="dropdown" to="/"
                >INICIO <i class="fa fa-angle-down" aria-hidden="true"></i
              ></router-link>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/about" @click="click_m()"
                    >SOBRE NOSOTROS</router-link
                  >
                </li>
              </ul>
            </li>

            <li>
              <router-link
                to="/historia"
                v-if="institucionData?.institucion_historia"
                >HISTORIA</router-link
              >
            </li>
            <li class="dropdown">
              <a data-toggle="dropdown" href="#"
                >CONVOCATORIAS
                <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu">
                <li v-for="(mc, id_mc) of MenuConv" :key="mc.idtipo_conv_comun || id_mc">
                  <router-link
                    :to="'/convocatorias/' + mc.idtipo_conv_comun"
                    @click="click_m()"
                  >
                    {{ mc.tipo_conv_comun_titulo }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#"
                >CURSOS <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu">
                <li v-for="(mc, id_mc) of MenuCur" :key="mc.idtipo_curso_otros || id_mc">
                  <router-link
                    :to="'/cursos/' + mc.idtipo_curso_otros"
                    @click="click_m()"
                  >
                    {{ mc.tipo_conv_curso_nombre }}
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#"
                >MÁS <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/servicios" @click="click_m()"
                    >SERVICIOS</router-link
                  >
                </li>
                <li>
                  <router-link to="/ofertas" @click="click_m()"
                    >OFERTAS ACADÉMICAS</router-link
                  >
                </li>
                <li>
                  <router-link to="/publicaciones" @click="click_m()"
                    >PUBLICACIONES</router-link
                  >
                </li>
                <li>
                  <router-link to="/gaceta" @click="click_m()"
                    >GACETA</router-link
                  >
                </li>
                <li>
                  <router-link to="/eventos" @click="click_m()"
                    >EVENTOS</router-link
                  >
                </li>
                <li>
                  <router-link to="/videos" @click="click_m()"
                    >VIDEOS</router-link
                  >
                </li>
              </ul>
            </li>

            <li class="dropdown">
              <a data-toggle="dropdown" href="#"
                >ENLACES <i class="fa fa-angle-down" aria-hidden="true"></i
              ></a>
              <ul class="dropdown-menu">
                <li v-for="(link, id_link) of linksData" :key="link.id_link || id_link">
                      <a :href="link.ei_link?.trim() || link.url_link?.trim()" 
         target="_blank" 
         rel="noopener noreferrer"
         :title="link.ei_tipo || link.tipo">
        {{ (link.ei_nombre || link.nombre)?.toUpperCase() }}
      </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
#header {
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
}
</style>

<script>
import { mapState } from "vuex";
import TopHeaderCustom from "@/components/TopHeaderCustom.vue";
import api from '@/plugins/axios';

export default {
  data() {
    return {
      sopen: false,
      m_inicio: false,
      m_conv: false,
      m_cur: false,
      m_mas: false,
      m_link: false,
      isHome: false,
    };
  },
  
  components: {
    TopHeaderCustom,
  },
  
  computed: {
    ...mapState(["url_api", "MenuConv", "MenuCur", "Institucion", "getter", "Links"]),
    
    institucionData() {
      return this.Institucion?.Descripcion || this.Institucion;
    },
    
    //  Adapter para Links (soporta nombres antiguos y nuevos de la API)
    linksData() {
      return this.Links?.map(link => ({
        id_link: link.id_link || link.id || link.ei_id,
        ei_link: link.ei_link || link.url_link,
        ei_nombre: link.ei_nombre || link.nombre,
        ei_tipo: link.ei_tipo || link.tipo,
        ei_estado: link.ei_estado ?? link.estado,
      })) || [];
    },
  },
  
  methods: {
    click_m() {
      this.$store.commit("clickLink");
     // this.$store.commit("idEncrypt");
      this.openMenu();
    },
    
showSubMenu(id) {
  const menus = { m_inicio: false, m_conv: false, m_cur: false, m_mas: false, m_link: false };
  
  //  Validación segura compatible con ESLint
  if (Object.hasOwn(menus, id)) {
    this[id] = true;

    Object.keys(menus).forEach(key => {
      if (key !== id) {
        this[key] = false;
      }
    });
  }
},
    
    openMenu() {
      this.sopen = !this.sopen;
    },
    
    async getLinks() {
      try {
        const idInstitucion = process.env.VUE_APP_ID_INSTITUCION;
        const res = await api.get(`/institucion/${idInstitucion}/recursos`);
        
        const links = res.data.linksExternoInterno || res.data.LinksExternoInterno || [];
        const filterLinks = links
          .filter(link => link.estado === 1 || link.ei_estado === "1")
          .map(link => ({
            ...link,
            ei_link: link.ei_link || link.url_link,
            ei_nombre: link.ei_nombre || link.nombre,
            ei_tipo: link.ei_tipo || link.tipo,
          }));
        
        this.$store.commit('setLinks', filterLinks);
        
      } catch (error) {
        console.error('Error cargando Links:', error);
        
        try {
          const res = await api.get(`/linksIntExtAll/${process.env.VUE_APP_ID_INSTITUCION}`);
          const filterLinks = res.data.filter(link => link.ei_estado == "1");
          this.$store.commit('setLinks', filterLinks);
        } catch (err) {
          console.error('Fallback failed:', err);
        }
      }
    },
  },
  
  created() {
    this.isHome = this.$route.path === "/";
    if (!this.Links?.length) {
      this.getLinks();
    }
  },
  
  mounted() {
    if (this.getter) {
      this.getLinks();
      this.$store.commit('setGetter', false);
    }
  },

  watch: {
    $route(to) {
      this.isHome = to.path === "/";
    },
  },
};
</script>